import { Github } from "lucide-react";

export const metadata = { title: "Research" };

export default function Research() {
  return (
    <main className="section shell" id="research">
      <h1 className="portal-title">Research</h1>
      <article aria-labelledby="resnet-anisotropy">
        <h2 id="resnet-anisotropy">
          Depth-Associated Late-Stage Representational Anisotropy in Pretrained ResNets
        </h2>
        <p>
          Across 100 Tiny ImageNet class pairs, this study uses the participation ratio to
          track how many directions account for the variance in feature representations
          at each residual block of five pretrained ResNets. From the end of Layer 3 to
          the end of Layer 4, the average participation ratio increased in ResNet-18 and
          ResNet-34 and fell in ResNet-50, ResNet-101, and ResNet-152, indicating more
          concentrated variance at the final block in the three deeper models.
        </p>
        <p>
          <a
            className="research-repo-link"
            href="https://github.com/Lawson-Dong/Depth-Associated-Late-Stage-Representational-Anisotropy-in-Pretrained-ResNets"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="research-repo-icon" aria-hidden="true">
              <Github size={17} />
            </span>
            <span>View code and results on GitHub</span>
          </a>
        </p>
      </article>
      <style>{`
        #research .research-repo-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          max-width: 100%;
          min-height: 48px;
          padding: 9px 16px 9px 10px;
          border: 1px solid #496b9a;
          border-radius: 12px;
          background: linear-gradient(120deg, #172540, #294d7c);
          color: #fff;
          box-shadow: 0 4px 12px #182d4a35;
          font-size: 0.9375rem;
          font-weight: 650;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }
        #research .research-repo-icon {
          display: grid;
          flex: none;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #ffffff20;
          transition: background-color 180ms ease, transform 180ms ease;
        }
        @media (hover: hover) {
          #research .research-repo-link:hover {
            transform: translateY(-3px);
            border-color: #8fbae9;
            box-shadow: 0 8px 22px #437cb65c;
          }
          #research .research-repo-link:hover .research-repo-icon {
            background: #ffffff38;
            transform: scale(1.1);
          }
        }
        #research .research-repo-link:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
          border-color: #8fbae9;
        }
        #research .research-repo-link:active {
          transform: translateY(1px) scale(0.98);
          box-shadow: 0 2px 6px #182d4a45;
        }
        @media (prefers-reduced-motion: reduce) {
          #research .research-repo-link,
          #research .research-repo-link .research-repo-icon {
            transition: none;
          }
          #research .research-repo-link:hover,
          #research .research-repo-link:active,
          #research .research-repo-link:hover .research-repo-icon {
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}
