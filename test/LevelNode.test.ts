
import { describe } from 'mocha';
import { expect } from 'chai';

import StringBuilder from '../src/lib/StringBuilder';
import { LevelNode as L } from '../src/lib/LevelNode';


function ToTestString(l: L<string>, prefix: string = "", sb?: StringBuilder) {
  if (!sb) {
    sb = new StringBuilder();
    sb.AppendLine();
  }
  if (l.Value)
    sb.Append(prefix).Append(l.Value || '').AppendLine();
  prefix += "  ";
  l.Children.forEach(item => {
    ToTestString(item, prefix, sb);
  });
  return sb.ToString();
}

const root = new L<string>(0);

describe('Items get check', () => {
  it("normal list should be correct", () => {
    root.Clear();
    expect(root.Count).to.eq(0);
    root.Append(new L(1, "# t1"));
    root.Append(new L(2, "## t1.1"));
    root.Append(new L(2, "## t1.2"));
    root.Append(new L(3, "### t1.2.1"));
    root.Append(new L(2, "## t1.3"));
    root.Append(new L(1, "# t2"));
    root.Append(new L(2, "## t2.1"));
    root.Append(new L(1, "# t3"));
    root.Append(new L(1, "# t4"));
    expect(root.Count).to.eq(4);
    expect(root.Get(0).Count).to.eq(3);
    expect(root.Get(0).Get(0).Count).to.eq(0);
    expect(root.Get(0).Get(1).Count).to.eq(1);
    expect(root.Get(0).Value).to.be.eq("# t1");
    expect(root.Get(0).Get(0).Value).to.eq("## t1.1");
    expect(root.Get(0).Get(1).Value).to.eq("## t1.2");
    expect(root.Get(0).Get(1).Get(0).Value).to.eq("### t1.2.1");
    expect(root.Get(0).Get(2).Value).to.eq("## t1.3");
    expect(root.Get(1).Value).to.be.eq("# t2");
    expect(root.Get(1).Get(0).Value).to.be.eq("## t2.1");
    expect(root.Get(2).Value).to.be.eq("# t3");
    expect(root.Get(3).Value).to.be.eq("# t4");
  });

  it("auto extend root should be correct", () => {
    root.Clear();
    expect(root.Count).to.eq(0);
    root.Append(new L(1, "# t1"));
    root.Append(new L(2, "## t1.1"));
    root.Append(new L(3, "### t1.1.1"));
    root.Append(new L(1, "# t2"));
    root.Append(new L(0, "~ 0"));
    expect(root.Count).to.eq(2);
    expect(root.Get(0).Count).to.eq(2);
    expect(root.Get(0).Value).to.be.not.exist;
    expect(root.Get(0).Get(0).Get(0).Get(0).Value).to.eq("### t1.1.1");
    expect(root.Level).to.eq(-1);

    root.Append(new L(-1, "~~ -1"));
    expect(root.Level).to.eq(-2);
    expect(root.Count).to.eq(2);
    expect(root.Get(0).Get(0).Count).to.eq(2);
    expect(root.Get(0).Get(0).Get(0).Get(0).Get(0).Value).to.eq("### t1.1.1");
    expect(root.Get(0).Get(0).Get(1).Value).to.eq("# t2");
  });

  it("empty node should be correct", () => {
    root.Clear();
    expect(root.Count).to.eq(0);
    root.Append(new L(2, "## t0.1"));
    root.Append(new L(2, "## t0.2"));
    root.Append(new L(2, "## t0.3"));
    root.Append(new L(1, "# t1"));
    root.Append(new L(1, "# t2"));
    root.Append(new L(1, "# t3"));

    expect(root.Count).to.eq(4);
    expect(root.Get(0).Value).to.be.not.exist;
    expect(root.Get(0).Count).to.eq(3);
    expect(root.Get(0).Get(2).Value).to.eq("## t0.3");
  });
});

describe('Shape tests', () => {
  it("should be < ", () => {
    root.Clear();
    expect(root.Count).to.eq(0);
    root.Append(new L(5, "# t5"));
    root.Append(new L(4, "# t4"));
    root.Append(new L(3, "# t3"));
    root.Append(new L(2, "# t2"));
    root.Append(new L(1, "# t1"));
    root.Append(new L(2, "# t2"));
    root.Append(new L(3, "# t3"));
    root.Append(new L(4, "# t4"));
    root.Append(new L(5, "# t5"));
    expect(ToTestString(root)).to.eq(
      `
          # t5
        # t4
      # t3
    # t2
  # t1
    # t2
      # t3
        # t4
          # t5
`
    );
  });

  it("should be > ", () => {
    root.Clear();
    expect(root.Count).to.eq(0);
    root.Append(new L(1, "# t1"));
    root.Append(new L(2, "# t2"));
    root.Append(new L(3, "# t3"));
    root.Append(new L(4, "# t4"));
    root.Append(new L(5, "# t5"));
    root.Append(new L(5, "# r5"));
    root.Append(new L(4, "# r4"));
    root.Append(new L(3, "# r3"));
    root.Append(new L(2, "# r2"));
    root.Append(new L(1, "# r1"));
    expect(ToTestString(root)).to.eq(
      `
  # t1
    # t2
      # t3
        # t4
          # t5
          # r5
        # r4
      # r3
    # r2
  # r1
`
    );
  });

  it("should be X ", () => {
    root.Clear();
    expect(root.Count).to.eq(0);
    root.Append(new L(1, "# t1"));
    root.Append(new L(5, "# t2"));
    root.Append(new L(2, "# t3"));
    root.Append(new L(4, "# t4"));
    root.Append(new L(1, "# t5"));
    root.Append(new L(5, "# t6"));
    expect(ToTestString(root)).to.eq(
      `
  # t1
            # t2
    # t3
          # t4
  # t5
            # t6
`
    );
  });
});