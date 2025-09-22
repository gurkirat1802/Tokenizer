import React, { useState } from "react";

// Custom word-to-token map
const customTokenMap = {
    "hey": 0,
    "hello": 1,
    "hi": 2,
    "name": 3,
    "there": 4,
};

// Reverse map (token-to-word)
const reverseCustomTokenMap = {};
for (let word in customTokenMap) {
    reverseCustomTokenMap[customTokenMap[word]] = word;
}

const getRandomColor = () => {
    // Dark mode friendly vibrant colors
    const colors = [
        "bg-red-600", "bg-green-600", "bg-yellow-500", "bg-blue-600",
        "bg-purple-600", "bg-pink-600", "bg-indigo-600", "bg-teal-600",
        "bg-orange-600", "bg-emerald-600", "bg-cyan-600", "bg-rose-600"
    ];
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
};


const AsciiTokenizer = () => {
    const [inputText, setInputText] = useState("");
    const [tokens, setTokens] = useState([]);
    const [decodeInput, setDecodeInput] = useState("");
    const [decodedText, setDecodedText] = useState("");

    // ENCODE function
    const encode = (text) => {
        const words = text.split(" ");
        const result = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase();

            if (customTokenMap[word] !== undefined) {
                result.push(customTokenMap[word]);
            } else {
                for (let j = 0; j < word.length; j++) {
                    result.push(word.charCodeAt(j));
                }
            }

            result.push(32); // space
        }

        return result;
    };

    // DECODE function
    const decode = (tokens) => {
        let result = "";
        let buffer = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (reverseCustomTokenMap[token] !== undefined) {
                // flush buffer
                if (buffer.length > 0) {
                    for (let j = 0; j < buffer.length; j++) {
                        result += String.fromCharCode(buffer[j]);
                    }
                    buffer = [];
                    result += " ";
                }

                result += reverseCustomTokenMap[token] + " ";
            } else if (token === 32) {
                if (buffer.length > 0) {
                    for (let j = 0; j < buffer.length; j++) {
                        result += String.fromCharCode(buffer[j]);
                    }
                    buffer = [];
                    result += " ";
                }
            } else {
                buffer.push(token);
            }
        }

        // flush any remaining characters in buffer
        if (buffer.length > 0) {
            for (let i = 0; i < buffer.length; i++) {
                result += String.fromCharCode(buffer[i]);
            }
        }

        return result.trim(); // remove any trailing space
    };

    const handleEncodeChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        setTokens(encode(text));
    };

    const handleDecodeChange = (e) => {
        const value = e.target.value;
        setDecodeInput(value);

        try {
            const tokenArray = value
                .split(",")
                .map((val) => val.trim())
                .filter((val) => val !== "")
                .map(Number)
                .filter((num) => !isNaN(num));

            setDecodedText(decode(tokenArray));
        } catch (err) {
            setDecodedText("Invalid input.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-start py-12 px-4">
            <div className="max-w-6xl w-full bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl">

                {/* Encoder Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-200">Encoder</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block mb-2 font-medium text-gray-400">Enter your query:</label>
                            <textarea
                                value={inputText}
                                onChange={handleEncodeChange}
                                rows={8}
                                placeholder="Type your text here..."
                                className="w-full p-4 border border-gray-700 rounded-lg bg-gray-900 text-gray-300 shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-400">Tokens:</label>
                            <textarea
                                value={tokens.join(", ")}
                                readOnly
                                rows={8}
                                className="w-full p-4 border border-gray-700 bg-gray-900 rounded-lg text-gray-400 shadow-inner resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <label className="block mb-2 font-medium text-gray-400">Colored representation:</label>
                        <div className="flex flex-wrap p-4 border border-gray-700 rounded-lg bg-gray-900 min-h-[3rem]">
                            {inputText.split(" ").map((word, wordIndex) => {
                                const lowerWord = word.toLowerCase();
                                const isCustom = customTokenMap[lowerWord] !== undefined;

                                if (isCustom) {
                                    return (
                                        <span
                                            key={wordIndex}
                                            className="px-3 py-1 m-1 rounded-full text-white bg-blue-600 text-sm shadow-lg"
                                        >
                                            {word}
                                        </span>
                                    );
                                } else {
                                    return (
                                        <span key={wordIndex} className="flex m-1">
                                            {word.split("").map((char, charIndex) => {
                                                const bgColor = getRandomColor();
                                                return (
                                                    <span
                                                        key={charIndex}
                                                        className={`px-2 py-1 mx-[1px] text-white text-sm rounded-md shadow-sm ${bgColor}`}
                                                    >
                                                        {char}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </section>

                {/* Decoder Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6 text-gray-200">Decoder</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block mb-2 font-medium text-gray-400">Enter your tokens:</label>
                            <textarea
                                value={decodeInput}
                                onChange={handleDecodeChange}
                                rows={8}
                                placeholder="Type tokens like: 1, 32, 110, 97, 109, 101"
                                className="w-full p-4 border border-gray-700 rounded-lg bg-gray-900 text-gray-300 shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-400">Decoded text:</label>
                            <textarea
                                value={decodedText}
                                readOnly
                                rows={8}
                                className="w-full p-4 border border-gray-700 bg-gray-900 rounded-lg text-gray-400 shadow-inner resize-none"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AsciiTokenizer;
