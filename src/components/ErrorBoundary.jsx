import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_error) { // eslint-disable-line no-unused-vars
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-white p-4">
                    <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong.</h1>
                    <div className="bg-gray-800 p-4 rounded max-w-full overflow-auto">
                        <p className="text-red-300 font-mono text-sm mb-2">{this.state.error && this.state.error.toString()}</p>
                        <details className="whitespace-pre-wrap font-mono text-xs text-gray-400">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
