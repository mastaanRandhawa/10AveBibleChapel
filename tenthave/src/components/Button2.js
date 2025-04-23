import "./Button.css";

function Button2({ variant, buttonLink, buttonText }) {
    return (
        <a href={buttonLink} className={`${variant}`} rel="noopener noreferrer">
            {buttonText}
        </a>

    );
}
export default Button2;
