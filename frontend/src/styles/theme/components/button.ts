import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
	baseStyle: {
		borderRadius: "full",
		color: "white",
	},
	variants: {
		grayPrimary: {
			bg: "rgba(217, 217, 217, 0.2)",
			color: "whiteAlpha.800",
			h: "30px",
			borderRadius: "sm",
			fontWeight: "400",
			_hover: {
				opacity: 0.8,
				bg: "rgba(217, 217, 217, 0.2)",
			},
			_disabled: {
				bg: "rgba(217, 217, 217, 0.2)",
				opacity: 0.8,
				color: "whiteAlpha.600",
				_hover: {
					opacity: 0.7,
					bg: "rgba(217, 217, 217, 0.2)!important",
				},
			},
			_active: {
				bg: "rgba(217, 217, 217, 0.2)",
			},
		},
	},
};
