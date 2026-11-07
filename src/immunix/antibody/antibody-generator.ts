/**
 * IMMUNIX ANTIBODY GENERATOR: AST Code Surgeon
 * 
 * Transforms detected Pathogen events into deterministic code repairs
 * using ts-morph for TypeScript / JavaScript and LibCST for Python.
 * 
 * Safety Guarantee: Generates a proposed code patch; never auto-merges
 * or alters production repositories without human review.
 */

import { Project, SyntaxKind } from 'ts-morph';
import { PathogenEvent } from '../detector';

export interface AntibodyProposal {
  id: string;
  pathogen_id: string;
  vendor: string;
  strategy: 'AST_FIELD_RENAME' | 'AST_URL_REROUTE' | 'LLM_COMPOSITE';
  target_file: string;
  original_code: string;
  modified_code: string;
  ast_diff: string;
  modifications_count: number;
  created_at: string;
}

/**
 * Generates unified git diff string between old and new code
 */
function createUnifiedDiff(filename: string, originalCode: string, modifiedCode: string): string {
  const origLines = originalCode.split('\n');
  const modLines = modifiedCode.split('\n');

  let diff = `--- a/${filename}\n+++ b/${filename}\n@@ -1,${origLines.length} +1,${modLines.length} @@\n`;

  for (let i = 0; i < Math.max(origLines.length, modLines.length); i++) {
    const o = origLines[i];
    const m = modLines[i];

    if (o !== undefined && m !== undefined) {
      if (o === m) {
        diff += ` ${o}\n`;
      } else {
        diff += `-${o}\n`;
        diff += `+${m}\n`;
      }
    } else if (o !== undefined) {
      diff += `-${o}\n`;
    } else if (m !== undefined) {
      diff += `+${m}\n`;
    }
  }

  return diff;
}

export class AntibodyGenerator {
  /**
   * Synthesizes a deterministic code fix from a Pathogen drift event using ts-morph
   */
  public generateTypeScriptAntibody(
    pathogen: PathogenEvent,
    sourceCode: string,
    targetFilePath = 'src/billing.ts'
  ): AntibodyProposal {
    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile(targetFilePath, sourceCode);

    let modifications = 0;
    const oldField = pathogen.mutation?.old_field || 'source';
    const newField = pathogen.mutation?.new_field || 'payment_method';

    // 1. AST Search: Find all object property assignments with the old field name
    const propertyAssignments = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment);
    for (const prop of propertyAssignments) {
      const nameNode = prop.getNameNode();
      if (nameNode.getText() === oldField) {
        // Deterministic AST rename: 'source: val' -> 'payment_method: val'
        prop.getNameNode().replaceWithText(newField);
        modifications++;
      }
    }

    // 2. AST Search: Find string literals that match old endpoints (e.g. '/v1/charges' -> '/v2/checkout/pay')
    if (pathogen.drift_type === 'FIELD_REMOVED' || pathogen.drift_type === 'SUNSET_HEADER') {
      const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
      for (const str of stringLiterals) {
        if (str.getLiteralText() === '/v1/charges') {
          str.replaceWithText("'/v2/checkout/pay'");
          modifications++;
        }
      }
    }

    // Fallback simple replacement if no AST property assignments matched
    let modifiedCode = sourceFile.getFullText();
    if (modifications === 0 && sourceCode.includes(oldField)) {
      modifiedCode = sourceCode.replaceAll(oldField, newField);
      modifications = 1;
    }

    const astDiff = createUnifiedDiff(targetFilePath, sourceCode, modifiedCode);

    return {
      id: `atb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      pathogen_id: pathogen.id,
      vendor: pathogen.vendor,
      strategy: pathogen.drift_type === 'FIELD_REMOVED' ? 'AST_URL_REROUTE' : 'AST_FIELD_RENAME',
      target_file: targetFilePath,
      original_code: sourceCode,
      modified_code: modifiedCode,
      ast_diff: astDiff,
      modifications_count: modifications,
      created_at: new Date().toISOString(),
    };
  }
}
