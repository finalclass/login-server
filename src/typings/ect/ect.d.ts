interface IECTOptions {
  watch?:boolean;
  root?:string;
  ext?:string;
}

interface IECTRenderer {
  render:()=>void;
}

declare module "ect" {
  function ECT(options:IECTOptions):IECTRenderer;

  export = ECT;
}