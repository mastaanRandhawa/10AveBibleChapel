import "./Button.css";

function Button({ variant, buttonLink, buttonText }) {
    return (
        <a href={buttonLink} className={`${variant}`} target="_blank" rel="noopener noreferrer">
            {buttonText}
        </a>

    );
}




export default Button;
