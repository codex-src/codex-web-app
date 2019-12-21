import * as Base from "./Base"
import React from "react"
import stylex from "stylex"
import { Check } from "react-feather"

const Text = stylex.Styleable(props => (
	<p {...props}>
		{props.children}
	</p>
))

const Subtext = stylex.Styleable(props => (
	<p style={stylex.parse("fw:500 fs:14 c:blue-a400")} {...props}>
		{props.children}
	</p>
))

const Discount = stylex.Styleable(props => (
	<span style={{ ...stylex.parse("p-x:4 p-y:6 inline-flex -r :center br:2"), background: "hsla(var(--green-a700), 0.05)", boxShadow: "inset 0 0 0 0.5px hsl(var(--green-a700), 0.25)" }} {...props}>
		<span style={stylex.parse("fw:700 fs:10.5 ls:5% lh:100% c:green-a700")}>
			{props.children}
		</span>
	</span>
))

const Checkmark = stylex.Styleable(props => (
	<Check style={stylex.parse("wh:16 square sw:900 c:green-a400")} {...props} />
))

export const SubscriptionOption = stylex.Styleable(props => (
	<Base.StyledButton style={stylex.parse("flex -r -x:between -y:center")} {...props}>
		{/* LHS */}
		<div>
			<Text>
				{props.text}
				{props.discount && (
					<React.Fragment>
						{" \u00a0"}
						<Discount>
							{props.discount}
						</Discount>
					</React.Fragment>
				)}
			</Text>
			<Subtext>
				{props.price}
			</Subtext>
		</div>
		{/* RHS */}
		<div>
			{props.selected && (
				<Checkmark />
			)}
		</div>
	</Base.StyledButton>
))

// Compound component.
export const SubscriptionSelect = stylex.Unstyleable(props => (
	<div style={{ ...stylex.parse("br:6"), ...Base.boxShadow }}>
		{React.cloneElement(
			props.children[0],
			{ style: stylex.parse("br-b:0") },
		)}
		<div style={stylex.parse("m-y:-1 h:1 b:gray-200")} />
		{React.cloneElement(
			props.children[1],
			{ style: stylex.parse("br-t:0") },
		)}
	</div>
))
