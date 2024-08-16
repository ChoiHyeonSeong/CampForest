const eventEmitter = {
  on(event: string, callback: Function) {
    document.addEventListener(event, (e: Event) => callback((e as CustomEvent).detail));
  },
  emit(event: string, data: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  off(event: string, callback: Function) {
    document.removeEventListener(event, callback as EventListener);
  }
};

export default eventEmitter;