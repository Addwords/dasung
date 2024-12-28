import { LegacyRef, Ref, forwardRef } from "react";
//buttonRef:LegacyRef<HTMLAnchorElement>
const Button = (props: any) =>{
	return ( 
    <>
		  <a
            className="group rounded-lg border border-slate-300
            px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100
            hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer mr-2 mb-2"
			rel="noopener noreferrer"
      style={{backgroundColor:props.color}}
      ref={(el:any)=>{
        if(typeof props.btnRef == 'function')
          props.btnRef(el);
      }}
			onClick={props.func}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              {props.text}
              {/* <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span> */}
			</h2>
			<p className="pl-5 text-2xl" dangerouslySetInnerHTML={{__html: props.subText}}></p>
			<p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
				{props.desc}
            </p>
          </a>
    </>
	 );
}
 
export default Button;