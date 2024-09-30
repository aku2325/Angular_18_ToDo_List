import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from '../../todo/src/app/root/root.component';

bootstrapApplication(RootComponent)
  .catch(err => console.error(err));
