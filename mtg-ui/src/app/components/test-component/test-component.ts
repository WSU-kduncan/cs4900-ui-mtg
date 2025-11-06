import { Component } from '@angular/core';
import { TestComponentStandalone } from '../test-component-standalone/test-component-standalone';

@Component({
  selector: 'app-test-component',
  imports: [TestComponentStandalone],
  templateUrl: './test-component.html',
  styleUrl: './test-component.scss',
})
export class TestComponent {

}
