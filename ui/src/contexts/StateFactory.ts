import FactoryInitializable from "../data/interfaces/FactoryInitializable";

export default class StateFactory<T extends FactoryInitializable<T>> {
  private createdStates: T[] = [];

  // Method to create a state
  public createState<U extends T>(StateClass: new (factory: StateFactory<T>) => U): U {
    const newState = new StateClass(this) as U;  // Type assertion here
    console.log('[State Factory] Creating state: ', newState);
    this.createdStates.push(newState);
    return newState;
  }

  public getState<U extends T>(StateClass: new (factory: StateFactory<T>) => U): U | undefined {
    return this.createdStates.find(state => state instanceof StateClass) as U;
  }

  // Method to signal that all created states are ready
  ready() {
    console.log('[State Factory] Available states: ', this.createdStates);
    this.createdStates.forEach((state) => {
      state.onFactoryReady(this);
    });
  }
}
