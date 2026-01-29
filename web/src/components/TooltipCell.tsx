import { useState, useRef, useEffect } from 'react';
import { Tooltip, Box } from '@mui/material';

export const TooltipCell = ({ content }: { content: string | null }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    checkTruncation();

    const observer = new ResizeObserver(checkTruncation);
    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, [content]);

  if (!content) return null;

  return (
    <Tooltip
      title={content}
      disableHoverListener={!isTruncated}
      enterDelay={500}
      slotProps={{
        tooltip: {
          sx: { fontSize: '0.875rem' },
        }
      }}
    >
      <Box
        ref={textRef}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {content}
      </Box>
    </Tooltip>
  );
};