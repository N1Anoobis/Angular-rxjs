import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { fromEvent, interval } from "rxjs";
import { map, mergeAll, take } from "rxjs/operators";

type Coords = [x: number, y: number];

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  TILE_SIZE = 70;
  COLS = 7;
  ROWS = 11;
  @ViewChild("mapGame", { static: false }) mapGame: ElementRef;

  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {}

  createElement([x, y]: Coords) {
    const point = this.renderer.createElement("div");

    if (point) {
      this.renderer.addClass(point, "Point");
      this.renderer.setStyle(point, "top", `${this.TILE_SIZE * x}px`);
      this.renderer.setStyle(point, "left", `${this.TILE_SIZE * y}px`);
      this.renderer.appendChild(this.mapGame.nativeElement, point);
      this.createElement2(point);
    }
  }

  createElement2(point) {
    const tile = this.renderer.createElement("div");
    this.renderer.addClass(tile, "Tile");
    this.renderer.appendChild(point, tile);
  }

  renderBox() {
    const colums$ = interval(200).pipe(take(this.COLS));

    const rows$ = fromEvent(document, "click").pipe(
      map((_, index) => index),
      take(this.ROWS)
    );

    const tiles$ = rows$.pipe(
      map((x) => colums$.pipe(map((y) => [x, y] as Coords))),
      mergeAll()
    );
    tiles$.subscribe((coord) => this.createElement(coord));
  }
}
