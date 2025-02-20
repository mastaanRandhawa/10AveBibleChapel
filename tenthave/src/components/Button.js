import "./Button.css";

function Button({ variant, buttonLink, buttonText }) {
    return (
        <a href={buttonLink} className={`${variant}`}>
            {buttonText}
        </a>
    );
}

export default Button;
