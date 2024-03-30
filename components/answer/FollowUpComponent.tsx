// 1. Defines the FollowUp interface with a 'choices' property that contains an array of objects with a 'message' property, which in turn has a 'content' property of type string.
interface FollowUp {
    choices: {
        message: {
            content: string;
        };
    }[];
}

const FollowUpComponent = ({ followUp, handleFollowUpClick }: { followUp: FollowUp; handleFollowUpClick: (question: string) => void }) => {
    const handleQuestionClick = (question: string) => {
        handleFollowUpClick(question);
    };

    let questions = [];
    // Attempt to detect and handle both response formats
    const content = followUp.choices[0].message.content;
    const hasCodeBlock = content.includes('```json');
    const jsonString = hasCodeBlock ? content.match(/```json\n([\s\S]*?)\n```/)[1].trim() : content;
    
    try {
        const parsedJson = JSON.parse(jsonString);
        // Handling different structures within "followUp"
        if (parsedJson.followUp[0].question) {
            // First format with direct "question" property
            questions = parsedJson.followUp.map(({ question }) => question);
        } else {
            // Second format, iterate over objects to extract questions
            questions = parsedJson.followUp.map(obj => obj[Object.keys(obj)[0]]);
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }

    return (
        <div className="dark:bg-slate-800 bg-white shadow-lg rounded-lg p-4 mt-4">
            {/* UI components remain the same */}
            <ul className="mt-2">
                {questions.map((question, index) => (
                    <li
                        key={index}
                        className="flex items-center mt-2 cursor-pointer"
                        onClick={() => handleQuestionClick(question)}
                    >
                        <span role="img" aria-label="link" className="mr-2 dark:text-white text-black">🔗</span>
                        <p className="dark:text-white text-black hover:underline">{question}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default FollowUpComponent;
