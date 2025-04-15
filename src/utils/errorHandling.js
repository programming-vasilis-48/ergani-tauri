export async function handleAsyncOperation(operation, options = {}, setState) {
    const { errorMessage = 'Operation failed', showLoading = true } = options;
    try {
        if (showLoading) {
            setState({ isProcessing: true, error: null });
        }
        const result = await operation();
        return result;
    }
    catch (error) {
        console.error(`${errorMessage}:`, error);
        setState({
            error: `${errorMessage}: ${error instanceof Error ? error.message : String(error)}`
        });
        return undefined;
    }
    finally {
        if (showLoading) {
            setState({ isProcessing: false });
        }
    }
}
export function logError(error, context = '') {
    const errorMessage = `${context}${context ? ': ' : ''}${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage);
    // You can add additional error logging here, like sending to a logging service
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
export function validateParams(params) {
    const requiredFields = ['output_dir'];
    const missingFields = requiredFields.filter(field => !params[field]);
    if (missingFields.length > 0) {
        throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }
}
