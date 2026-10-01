import katex from 'katex';

/** Render authored LaTeX with accessible MathML; HTML commands remain disabled. */
export function MathTex({tex, display = false}: {tex: string; display?: boolean}) {
  const html = katex.renderToString(tex, {displayMode: display, throwOnError: true, trust: false, output: 'htmlAndMathml'});
  return <span className={display ? 'math-tex math-display' : 'math-tex'} dangerouslySetInnerHTML={{__html: html}} />;
}

export function mathNotation(text: string) {
  return text.replace(/₁/g, '_1').replace(/₂/g, '_2').replace(/←/g, '\\leftarrow ').replace(/↔/g, '\\leftrightarrow ').replace(/−/g, '-');
}
