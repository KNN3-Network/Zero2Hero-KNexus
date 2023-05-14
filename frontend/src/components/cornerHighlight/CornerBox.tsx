import { Box, Image, Center } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import CornerHighlight from "./CornerHighlight";

interface CornerBoxProps {
	children: ReactNode;
	className?: any;
}

const CornerBox: React.FC<CornerBoxProps> = (props) => {
	const { className, children } = props;
	return (
		<Box className={`relative w-full h-full ${className} `}>
			<CornerHighlight
				cornerHighlightPosition="cornerHighlightTL"
				className="!absolute h-full"
			>
				<Image
					className="h-full"
					src="/images/Vector-Left-Bracket.svg"
					alt=""
				/>
			</CornerHighlight>
			<Box className="absolute w-full h-full">{children}</Box>
			<CornerHighlight
				cornerHighlightPosition="cornerHighlightBR"
				className="!absolute h-full right-0 "
			>
				<Image
					className="h-full"
					src="/images/Vector-Right-Bracket.svg"
					alt=""
				/>
			</CornerHighlight>
		</Box>
	);
};

export default CornerBox;
