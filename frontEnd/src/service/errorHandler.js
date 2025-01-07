const errorHandler = (response) => {
    if (response.detail) {
        throw new Error(response.detail);
    }

    console.log(response.message, "response.message", 1111111111111111);
    if (response.message && typeof response.message === 'string') {
        throw new Error(response.message);
    }
    if (response.message && Array.isArray(response.message)) {
        throw new Error(response.message.join("\n"));
    }
    if (response.message && typeof response.message === 'object') {
        const formattedMessage = Object.entries(response.message)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        throw new Error(formattedMessage);
    }

    // Generic fallback for unhandled cases
    throw new Error('An unexpected error occurred.');
};

export default errorHandler;