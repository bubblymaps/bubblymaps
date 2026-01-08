export default function RedirectToBubbly() {
    return (
        <script dangerouslySetInnerHTML={{__html: `
            window.location.href = '/u/bubbly';
        `}} />
    )
}