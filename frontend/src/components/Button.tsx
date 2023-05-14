export default function Button(props:any) {
  return ( 
  <button className={`bg-[rgba(217,217,217,0.2)] font-swiss721md p-2 rounded tracking-wide w-36 ${props.className}`} onClick={props.onClick} disabled={props?.disabled}>
    {props.children}
  </button>
  )
}