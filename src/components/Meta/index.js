import React from "react"
import trimSpaces from "lib/trimSpaces"

export const SelectNone = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`${children.props.className}
			select-none
				${className}`),
	})
)

export const HeaderBlock = ({ className, children: child }) => {
	const children = !Array.isArray(child) ? [child] : child
	return (
		<SelectNone>
			<div className={className}>
				{React.cloneElement(children[0], {
					className: trimSpaces(`font-medium text-3xl sm:text-4xl Poppins
						${children[0].props.className}`),
				})}
				{children.length === 2 && (
					React.cloneElement(children[1], {
						className: trimSpaces(`text-lg Poppins
							${children[1].props.className}`),
					})
				)}
			</div>
		</SelectNone>
	)
}

export const Transition = ({ className, duration, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`${children.props.className}
			transition duration-${duration || 150} ease-in-out
				${className}`),
	})
)

export const Focusable = ({ className, children }) => (
	<Transition>
		{React.cloneElement(children, {
			className: trimSpaces(`${children.props.className}
				focus:outline-none focus:shadow-outline-blue
					${className}`),
		})}
	</Transition>
)

// https://tailwindui.com/components/application-ui/forms/sign-in-forms
export const SocialButton = ({ className, children }) => (
	<Focusable>
		<Transition>
			{React.cloneElement(children, {
				className: trimSpaces(`${children.props.className}
					px-4 py-2 w-full inline-flex flex-row justify-center leading-5 bg-white border border-gray-300 focus:border-blue-300 rounded-md hover:opacity-90 active:opacity-100
						${className}`),
			})}
		</Transition>
	</Focusable>
)

// // https://tailwindui.com/components/application-ui/forms/sign-in-forms
// export const SolidSocialButton = ({ className, children }) => (
// 	<Focusable>
// 		<Transition>
// 			{React.cloneElement(children, {
// 				className: trimSpaces(`${children.props.className}
// 					px-4 py-2 w-full inline-flex flex-row justify-center leading-5 border border-transparent rounded-md hover:opacity-90 active:opacity-100
// 						${className}`),
// 				},
// 			)}
// 		</Transition>
// 	</Focusable>
// )

export const Label = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`${children.props.className}
			block font-medium text-sm leading-5 text-gray-700
				${className}`),
	})
)

export const InputBlock = ({ className, children }) => (
	<div className={className}>
		<Label>
			{children[0]}
		</Label>
		<div className="mt-1 rounded-md shadow-sm">
			<Transition>
				{React.cloneElement(children[1], {
					className: trimSpaces(`form-input w-full sm:text-sm sm:leading-5
						${children[1].props.className}`),
				})}
			</Transition>
		</div>
		{/* {children[2] && ( */}
  	{/* 	<p className="mt-2 text-sm text-gray-500"> */}
		{/* 		{children[2]} */}
		{/* 	</p> */}
		{/* )} */}
	</div>
)
