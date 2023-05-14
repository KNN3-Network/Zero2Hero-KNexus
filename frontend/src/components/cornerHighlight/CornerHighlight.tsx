import React, { ReactNode } from "react"
import styles from './CornnerHighlight.module.css';

interface CornerHighlightProps {
    children: ReactNode,
    className?: any,
    cornerHighlightPosition: 'cornerHighlightTL' | 'cornerHighlightBR'
}

const CornerHighlight: React.FC<CornerHighlightProps> = (props) => {
    const {className, children, cornerHighlightPosition} = props;
    return (
        <div className={`${className} ${styles[cornerHighlightPosition]}`}>
            {children}
        </div>
    )
}

export default CornerHighlight;