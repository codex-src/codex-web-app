// <SwitchOnCase case={...}>...<SwitchOnCase>
export const SwitchOnCase = ({ children }) => (
	children
)

// <SwitchOn on={...}>
//   <SwitchOnCase case={...}>...<SwitchOnCase>
//   <SwitchOnCase case={...}>...<SwitchOnCase>
//   <SwitchOnCase case={...}>...<SwitchOnCase>
// </SwitchOn>
export const SwitchOn = ({ on, children }) => {
	const match = children.find(each => each.props.case === on)
	if (!match) {
		throw new Error("SwitchOn: no such match")
	}
	return match
}
