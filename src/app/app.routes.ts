
import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { Topics } from './pages/topics/topics';
import { Registrations } from './pages/registrations/registrations';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'students', component: Students },
    { path: 'topics', component: Topics },
    { path: 'registrations', component: Registrations },
    { path: '**', redirectTo: 'dashboard' }
];
