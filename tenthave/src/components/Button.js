import "./Button.css";

function Button({ variant, buttonLink, buttonText }) {
    return (
        <div href={buttonLink} className={`${variant}`} target="_blank" rel="noopener noreferrer">
            {buttonText}
        </div>

    );
}

export default Button;
