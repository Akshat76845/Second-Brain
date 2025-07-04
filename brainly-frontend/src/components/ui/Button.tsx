interface ButtonInterface  {
    title: string;
    size: "lg" | "sm" | "md";
}
const sizeStyles = {
    "lg" : "px-8 py-4 text-xl",
    "md" : "px-4 py-2 text-md",
    "sm" : "px-2 py-1 text-sm",
}
export function Button(props:ButtonInterface){
    return <button className={sizeStyles[props.size] + "bg-red-200"}>
        {props.title}
    </button>
}