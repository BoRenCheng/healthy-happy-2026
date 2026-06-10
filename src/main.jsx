import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/noto-sans-tc/400.css'
import '@fontsource/noto-sans-tc/500.css'
import '@fontsource/noto-sans-tc/700.css'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui', color: '#2C2C2C', lineHeight: 1.6 }}>
          <h2 style={{ color: '#E8916A' }}>⚠️ 載入發生問題</h2>
          <p style={{ fontSize: 14, color: '#8A8A8A' }}>請截圖以下訊息以便除錯：</p>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#FAFAFA', padding: 12, borderRadius: 8, fontSize: 12 }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
