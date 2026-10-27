/**
 * Text that can rise or fill in word by word. Screen readers get the sentence once, from the visually hidden copy;
 * the split copy is hidden from them, so no one hears it word by word. Motion comes from data attributes on the
 * parent (data-words, data-fill), read by PageMotion.
 */
export function Words({ text }: { text: string }) {
  const parts = text.split(/(\s+)/).filter(Boolean);
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {parts.map((part, i) =>
          /^\s+$/.test(part) ? (
            ' '
          ) : (
            <span key={i} className="w">
              <span className="wi">{part}</span>
            </span>
          ),
        )}
      </span>
    </>
  );
}
