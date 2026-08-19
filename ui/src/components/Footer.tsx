import { Router } from '../router';
import './Footer.scss'

export default function Footer() {
    return (<footer>
        <a href={Router.paths.about}>About</a>
    </footer>
    )
}