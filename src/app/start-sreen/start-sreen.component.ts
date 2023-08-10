import { Component } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-sreen',
  templateUrl: './start-sreen.component.html',
  styleUrls: ['./start-sreen.component.scss']
})
export class StartSreenComponent {

  private gamesCollection: CollectionReference<DocumentData>;

  constructor(private router: Router, private firestore: Firestore) {
    this.firestore = firestore;
    this.gamesCollection = collection(this.firestore, 'games');
  }

  newGame() {
    let game = new Game();
    addDoc(this.gamesCollection, game.toJson())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });
  }
}
