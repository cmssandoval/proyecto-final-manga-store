const parseRequest = (schema, value, res) => {
    const result = schema.safeParse(value);
    if (!result.success) {
        res.status(400).json({
            message: result.error.issues[0]?.message || 'Invalid request',
        });
        return null;
    }
    return result.data;
};

export default parseRequest;
