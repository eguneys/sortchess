import { ParentProps } from "solid-js";

export default function Regular(props: ParentProps) {
    return (<>
        <div class='regular-wrapper'>
            {props.children}
        </div>
    </>)
}