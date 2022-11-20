import { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	render() {
		const { hasError } = this.state;
		// eslint-disable-next-line react/prop-types
		const { children } = this.props;
		if (hasError) {
			// You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}

		return children;
	}
}

export default ErrorBoundary;
