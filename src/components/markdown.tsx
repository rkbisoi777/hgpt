import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

const MemoizedReactMarkdown = memo(({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            children={content}
            components={{
                ul: ({ children }) => (
                    <ul className="ml-4 -mt-4">{children}</ul>  
                ),
                li: ({ children }) => (
                    <li className="ml-4 -my-1 list-disc">{children}</li>  
                ),
                p: ({ children }) => (
                    <p className="-my-1">{children}</p>  
                ),
                strong: ({ children }) => (
                    <strong className="-my-1">{children}</strong>
                ),
            }}
        />
    );
});



export default MemoizedReactMarkdown;
