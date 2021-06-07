/**
 *  https://github.com/apollographql/apollo-link/issues/646#issuecomment-423279220
 */
import { Observable } from 'apollo-link';

export default function promiseToObservable(promise) {
    return new Observable((subscriber) => {
        promise.then(
            (value) => {
                if (subscriber.closed) return;
                subscriber.next(value);
                subscriber.complete();
            },
            err => subscriber.error(err)
        );
        return subscriber; // this line can removed
    });
};