import { LetDirective } from './let.directive';

export class LetContext<T> {

    /** сама переменная */
    public get abLet(): T {
        return this._dir.abLet;
    }

    /** контекст переменной для async pipe */
    constructor(private readonly _dir: LetDirective<T>) {
    }
}
