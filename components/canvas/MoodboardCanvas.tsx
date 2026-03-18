'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Group, Transformer } from 'react-konva';
import useImage from 'use-image';
import { BoardItem } from '@/lib/supabase';
import { motion } from 'motion/react';

interface CanvasImageProps {
  item: BoardItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<BoardItem>) => void;
}

const CanvasImage = ({ item, isSelected, onSelect, onChange }: CanvasImageProps) => {
  const [image] = useImage(item.content.url);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale to 1 and update width/height instead
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

interface MoodboardCanvasProps {
  items: BoardItem[];
  onUpdateItem: (id: string, updates: Partial<BoardItem>) => void;
}

export default function MoodboardCanvas({ items, onUpdateItem }: MoodboardCanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#121212] overflow-hidden relative">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
        onTap={handleStageClick}
        draggable // Infinite canvas panning
      >
        <Layer>
          {/* Grid Background */}
          <Group>
            {Array.from({ length: 100 }).map((_, i) => (
              <React.Fragment key={i}>
                <Rect
                  x={i * 50 - 2500}
                  y={-2500}
                  width={1}
                  height={5000}
                  fill="rgba(255,255,255,0.05)"
                />
                <Rect
                  x={-2500}
                  y={i * 50 - 2500}
                  width={5000}
                  height={1}
                  fill="rgba(255,255,255,0.05)"
                />
              </React.Fragment>
            ))}
          </Group>

          {items.map((item) => (
            <CanvasImage
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={() => setSelectedId(item.id)}
              onChange={(updates) => onUpdateItem(item.id, updates)}
            />
          ))}
        </Layer>
      </Stage>

      {/* Floating Toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
        <button className="text-white/60 hover:text-white transition-colors">
          <span className="text-xs font-mono uppercase tracking-widest">Image</span>
        </button>
        <button className="text-white/60 hover:text-white transition-colors">
          <span className="text-xs font-mono uppercase tracking-widest">Note</span>
        </button>
        <button className="text-white/60 hover:text-white transition-colors">
          <span className="text-xs font-mono uppercase tracking-widest">Look</span>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button className="text-white/60 hover:text-white transition-colors">
          <span className="text-xs font-mono uppercase tracking-widest">Import</span>
        </button>
      </div>
    </div>
  );
}
