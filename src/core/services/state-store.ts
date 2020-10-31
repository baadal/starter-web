import { Subject, BehaviorSubject, interval } from 'rxjs';
import { scan } from 'rxjs/operators';

class StateStore {
  public static _initialize() {
    StateStore.clickEvent$.pipe(scan((acc, curr) => acc + curr, 0)).subscribe(StateStore.clickCounter$);
  }

  public static clickEvent$ = new Subject<number>();
  public static clickCounter$ = new BehaviorSubject<number>(0);
  public static clockTimer$ = interval(500);
}

StateStore._initialize();

export default StateStore;
