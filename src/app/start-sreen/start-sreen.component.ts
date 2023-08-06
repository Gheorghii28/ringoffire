import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-sreen',
  templateUrl: './start-sreen.component.html',
  styleUrls: ['./start-sreen.component.scss']
})
export class StartSreenComponent {

  constructor(private router: Router) {

  }

  newGame() {
    this.router.navigateByUrl('/game');
  }
}
