import { MathTex } from '@/components/math';
import Link from 'next/link';
import './measuring-tools.css';

export const metadata = {
  title: 'The measuring tools — Lawson Dong',
  description: 'Adjacent Linear CKA and raw-vector Fisher ratio: concise definitions and formulas.',
};

export default function MeasuringTools() {
  return <main className="shell measuring-tools">
    <Link className="text-link" href="/#research">Back to Research</Link>
    <header className="tools-intro">
      <p className="eyebrow">REPRESENTATION ANALYSIS / METHODS</p>
      <h1>The measuring tools</h1>
    </header>
    <article aria-labelledby="cka-title">
      <p className="eyebrow">01 / REPRESENTATION SIMILARITY</p>
      <h2 id="cka-title">Adjacent Linear CKA</h2>
      <p><strong>Structure preserved between consecutive layers.</strong></p>
      <p>Centered Kernel Alignment · same samples · centered features</p>
      <p>Subtracting the mean removes absolute position, so CKA compares the internal geometry of the representations.</p>
      <MathTex display tex={String.raw`X=Z_\ell-\mathbf1\bar z_\ell^\top,\qquad Y=Z_{\ell+1}-\mathbf1\bar z_{\ell+1}^\top`} />
      <div className="tools-formula"><MathTex display tex={String.raw`\operatorname{CKA}(X,Y)=\frac{\|X^\top Y\|_F^2}{\|X^\top X\|_F\,\|Y^\top Y\|_F}`} /></div>
      <div className="tools-reading">
        <div><h3>Closer to 1</h3><p>Similar structure</p></div>
        <div><h3>Closer to 0</h3><p>Less similar structure</p></div>
      </div>
      <p>Sharp drop → inspect geometric restructuring. A drop alone does not establish a phase transition.</p>
      <details><summary>Notation &amp; invariance</summary>
        <MathTex display tex={String.raw`Z_\ell\in\mathbb R^{n\times d_\ell},\quad \bar z_\ell=\frac1n\sum_{i=1}^n z_i^{(\ell)},\quad \|M\|_F=\sqrt{\sum_{i,j}M_{ij}^2}`} />
        <p>Rows: samples in the same order. Defined when the denominator is nonzero.</p>
        <MathTex display tex={String.raw`\operatorname{CKA}(aXQ,bYR)=\operatorname{CKA}(X,Y),\quad a,b\ne0,\quad Q^\top Q=R^\top R=I`} />
        <p>Invariant to orthogonal rotations and uniform scaling.</p>
      </details>
      <p className="tools-source"><a href="https://proceedings.mlr.press/v97/kornblith19a.html" target="_blank" rel="noopener noreferrer">Kornblith et al. (2019)</a></p>
      <p className="tools-source"><a href="https://github.com/Lawson-Dong/representation-alignment-/blob/representation-vector-geometric-dynamics/experiments/geometric_dynamics/scripts/metrics.py#L32-L39" target="_blank" rel="noopener noreferrer">Experiment implementation</a></p>
    </article>
    <article id="fisher-ratio" aria-labelledby="fisher-title">
      <p className="eyebrow">02 / CLASS SEPARATION</p>
      <h2 id="fisher-title">Raw-vector Fisher ratio</h2>
      <MathTex display tex={String.raw`F_\ell=\frac{\text{between-class separation}}{\text{within-class dispersion}}`} />
      <h3>Why raw vectors?</h3>
      <p><strong>Full-dimensional geometry · No projection before measurement</strong></p>
      <div className="tools-formula"><MathTex display tex={String.raw`z_i^{(\ell)}\in\mathbb R^{d_\ell}\quad\xrightarrow{\text{measure directly}}\quad F_\ell`} /></div>
      <p>For example: <MathTex tex={String.raw`d_\ell=768`} /> → measure in all 768 dimensions.</p>
      <MathTex display tex={String.raw`z_i^{(\ell)}\xrightarrow{\text{PCA / UMAP / t-SNE}}p_i\in\mathbb R^{2\text{ or }3}\quad\text{(visualization only)}`} />
      <p>A projected plot can hide or distort high-dimensional geometry.</p>
      <p><strong>Direction + magnitude · Before unit normalization</strong></p>
      <MathTex display tex={String.raw`\hat z_i=\frac{z_i}{\|z_i\|_2},\qquad z_j=\alpha z_i\ (\alpha>0)\ \Rightarrow\ \hat z_j=\hat z_i`} />
      <p>Normalization removes length differences; raw Fisher retains them. Cosine metrics complement it by focusing on direction.</p>
      <div className="tools-reading">
        <div><h3>Higher F</h3><p>Greater separation relative to spread</p></div>
        <div><h3>Lower F</h3><p>Less separation relative to spread</p></div>
      </div>
      <details><summary>Full definition</summary>
        <p>C / D: cat / dog samples · N: class size · μ: centroid</p>
        <MathTex display tex={String.raw`\mu_C=\frac1{N_C}\sum_{i\in C}z_i,\qquad \mu_D=\frac1{N_D}\sum_{i\in D}z_i`} />
        <div className="tools-formula"><MathTex display tex={String.raw`F=\frac{\|\mu_C-\mu_D\|_2^2}{\frac1{N_C}\sum_{i\in C}\|z_i-\mu_C\|_2^2+\frac1{N_D}\sum_{i\in D}\|z_i-\mu_D\|_2^2}`} /></div>
        <MathTex display tex={String.raw`F(az)=F(z)\quad(a\ne0),\qquad F\in[0,\infty)`} />
        <p>Uniform scaling cancels; feature-specific scaling can change F. These statements assume a positive denominator; the code floors it at <MathTex tex={String.raw`10^{-20}`} />.</p>
      </details>
      <p>Higher F does not by itself guarantee better classification accuracy.</p>
      <p className="tools-source"><a href="https://github.com/Lawson-Dong/representation-alignment-/blob/representation-vector-geometric-dynamics/experiments/geometric_dynamics/scripts/metrics.py" target="_blank" rel="noopener noreferrer">Experiment implementation</a></p>
    </article>
  </main>;
}
