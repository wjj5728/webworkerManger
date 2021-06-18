class actionName {
  parse = 'parse';
  transform = 'transform';
  filterTime = 'filterTime';
}
interface WebworkerRep {
  data: any;
}
interface postMessageAction {
  name: keyof actionName;
  [K: string]: any;
}
class WebworkerManger {
  private worker: Worker | null = null;
  private actionHandlerMap = new Map<number, Function>();
  private name = '';
  private url = '';
  uuid = 0;
  private get Ins() {
    if (this.worker == null) {
      this.worker = new Worker(this.url, { name: this.name });
      this.init();
    }
    return this.worker;
  }
  constructor(url = './webworker.js', name: string) {
    this.url = url;
    this.name = name;
    this.worker = new Worker(this.url, { name: this.name });
    this.init();
  }
  init() {
    this.worker!.onmessage = this.onmessage.bind(this);
  }
  private onmessage(e: any) {
    const { id } = e.data;
    if (!this.actionHandlerMap.has(id)) return;
    this.actionHandlerMap.get(id)!.call(this, e);
    this.actionHandlerMap.delete(id);
    this.close();
  }
  postMessage(action: postMessageAction): Promise<WebworkerRep> {
    const id = this.uuid++;
    let worker = this.Ins;
    return new Promise((resolve, reject) => {
      const message = {
        id,
        ...action,
      };
      worker.postMessage(message);
      this.actionHandlerMap.set(id, (res: WebworkerRep) => {
        resolve(res);
      });
    });
  }
  close() {
    this.worker!.terminate();
    this.worker = null;
  }
}
export { WebworkerManger };
