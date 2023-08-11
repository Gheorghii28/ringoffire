import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collectionData, collection, CollectionReference, DocumentData, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  game: Game;
  gameId: string = '';
  gameOver: boolean = false;
  items$: Observable<any[]>;

  private gamesCollection: CollectionReference<DocumentData>;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {
    this.game = new Game();
    this.firestore = firestore;
    this.gamesCollection = collection(this.firestore, 'games');
    this.items$ = collectionData(this.gamesCollection);

  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.items$.subscribe((game) => {
        this.gameId = params['id'];
        this.getGame(params);
      });

    });
  }

  async getGame(params: any) {
    const gameId = this.gameId;
    const gameDocRef = doc(this.gamesCollection, gameId);
    try {
      const docSnapshot = await getDoc(gameDocRef);
      if (docSnapshot.exists()) {
        const gameData: any = docSnapshot.data();
        this.game.currentPlayer = gameData.currentPlayer;
        this.game.playedCards = gameData.playedCards;
        this.game.players = gameData.players;
        this.game.stack = gameData.stack;
        this.game.pickCardAnimation = gameData.pickCardAnimation;
        this.game.currentCard = gameData.currentCard;
        this.game.playerImages = gameData.playerImages;
      } else {
        console.log('Das Dokument existiert nicht.');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Dokuments:', error);
    }
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop() || '';
        this.game.pickCardAnimation = true;
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        this.saveGame();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 1000);
      }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('2.png');
        this.saveGame();
      }
    });
  }

  saveGame() {
    const gamesDocumentReference = doc(this.gamesCollection, this.gameId);
    updateDoc(gamesDocumentReference, this.game.toJson())
      .then(() => {
        console.log("Spiel erfolgreich aktualisiert.");
      })
      .catch((error) => {
        console.error("Fehler beim Aktualisieren des Spiels:", error);
      });
  }

  editPlayer(playerId: number) {
    console.log('player:', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Recieved change:', change);
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGame();
      }
    });
  }
}
