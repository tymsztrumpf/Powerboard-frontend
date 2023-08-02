import {
    Container,
    LargeFont,
    MediumFont,
    TextContainer,
    ButtonContainer,
    StyledButton,
    ImageContainer,
    ActivityVisualization
} from "./HomePage.style";
import {useEffect, useState} from "react";
const HomePage = () => {
    const totalSquares = 12 * 7;
    const generateColorShades = (totalSquares: number) => {
        const colors = [];
        for (let shade = 0; shade < totalSquares; shade++) {
            const lightness = 40 + Math.floor(Math.random() * 31);
            colors.push(`hsl(209, 100%, ${lightness}%)`);
        }

        return colors;
    };

    const generateRandomlyMissingSquares = (totalSquares: number, missingPercentage: number) => {
        const squaresWithMissing = [];
        const missingCount = Math.floor(totalSquares * missingPercentage);

        for (let i = 0; i < totalSquares; i++) {
            if (i < missingCount) {
                squaresWithMissing.push(true);
            } else {
                squaresWithMissing.push(false);
            }
        }

        for (let i = totalSquares - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [squaresWithMissing[i], squaresWithMissing[j]] = [
                squaresWithMissing[j],
                squaresWithMissing[i],
            ];
        }

        return squaresWithMissing;
    };

    const colorShades = generateColorShades(totalSquares);
    const missingSquares = generateRandomlyMissingSquares(totalSquares, 0.25);
    const [blinkingSquare, setBlinkingSquare] = useState<number | null>(null);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * totalSquares);
        setBlinkingSquare(randomIndex);
    }, []);

    return (
        <Container>
            <TextContainer>
                <LargeFont>Powerboard combines </LargeFont>
                <LargeFont>all tasks and tools </LargeFont>
                <LargeFont>to achieve maximum efficiency.</LargeFont>
                <MediumFont>
                    Organize work, achieve efficiency!
                </MediumFont>
                <ButtonContainer>
                    <StyledButton href="/signup" color="primary" variant="contained">
                        Sign up
                    </StyledButton>
                    <StyledButton color="secondary" variant="contained">
                        How it works?
                    </StyledButton>
                </ButtonContainer>
            </TextContainer>
            <ImageContainer>
                <ActivityVisualization color={colorShades[0]}>
                    {colorShades.map((color, index) => {
                        if (missingSquares[index]) {
                            return <div key={index} style={{background: "transparent"}}/>;
                        } else {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        background: color,
                                        animation: blinkingSquare === index ? "blink 1s infinite" : "none",
                                    }}
                                    className={blinkingSquare === index ? "blinking" : ""}
                                />
                            );
                        }
                    })}
                </ActivityVisualization>
            </ImageContainer>
        </Container>
    );
}

export default HomePage;