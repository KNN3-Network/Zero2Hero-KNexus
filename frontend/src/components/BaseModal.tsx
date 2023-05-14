import {
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalContent,
	ModalOverlay,
} from "@chakra-ui/react";
import type React from "react";

export type BaseModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	isCentered?: boolean;
	children?: React.ReactElement | React.ReactElement[];
	maxW?: number | string;
	title?: string | React.ReactElement;
};

export const BaseModal: React.FC<BaseModalProps> = (props) => {
	const { isOpen, onClose, maxW, children, isCentered, title } = props;

	return (
		<Modal
			isOpen={isOpen}
			isCentered={isCentered !== undefined ? isCentered : true}
			motionPreset="slideInBottom"
			onClose={onClose}
		>
			<ModalOverlay className="backdrop-blur transition" />
			<ModalContent maxW={maxW} w="auto" borderRadius="0" bg="#222222">
				{title ? (
					<ModalHeader
						maxW="calc(100% - 60px)"
						whiteSpace="nowrap"
						textOverflow="ellipsis"
						overflow="hidden"
						fontSize="md"
					>
						{title}
					</ModalHeader>
				) : null}
				<ModalCloseButton
					bg="#A0A79F"
					color="#000000"
					borderRadius="0"
					w="20px"
					h="20px"
					fontSize="12px"
					mt="-7px"
					mr="-11px"
				/>
				<ModalBody pb={6} className="text-[#fff]">{children}</ModalBody>
			</ModalContent>
		</Modal>
	);
};
