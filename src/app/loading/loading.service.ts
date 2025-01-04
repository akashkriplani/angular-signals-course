import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  #loadingSignal = signal<boolean>(false);
  loading = this.#loadingSignal.asReadonly();

  loadingOff = () => this.#loadingSignal.set(false);
  loadingOn = () => this.#loadingSignal.set(true);
}
