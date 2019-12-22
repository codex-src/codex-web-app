import isMetaOrCtrlKey from "./metaKey"
import platform from "./platform"

const exports = {
  ...platform, // Use spread.
  isMetaOrCtrlKey,
}

export default exports
