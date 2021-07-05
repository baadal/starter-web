import { interval } from 'rxjs';

class StateStore {
  public static timer$ = interval(500);
}

export default StateStore;
