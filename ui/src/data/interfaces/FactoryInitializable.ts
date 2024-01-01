import StateFactory from "../../contexts/StateFactory";

export default interface FactoryInitializable<T extends FactoryInitializable<T>> {
    onFactoryReady(factory: StateFactory<T>): void;
}