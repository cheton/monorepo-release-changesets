---

---
    
bump to yarn 3.2.4 [#1](https://github.com/cheton/monorepo-release-changesets/pull/1)
    
### **PR Type**
Enhancement, Configuration changes


___

### **Description**
- Configured Yarn 3.2.4 in `.yarnrc.yml`.
- Updated Lerna configuration in `lerna.json` to align with Yarn.
- Modified `package.json` to reflect project details and dependencies, including specifying Yarn 3.2.4 as the package manager.



___



### **Changes walkthrough** 📝
<table><thead><tr><th></th><th align="left">Relevant files</th></tr></thead><tbody><tr><td><strong>Configuration changes</strong></td><td><table>
<tr>
  <td>
    <details>
      <summary><strong>.yarnrc.yml</strong><dd><code>Configure Yarn 3.2.4 in .yarnrc.yml</code>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </dd></summary>
<hr>

.yarnrc.yml

<li>Added <code>nodeLinker</code> configuration.<br> <li> Set <code>yarnPath</code> to use Yarn 3.2.4.<br>


</details>


  </td>
  <td><a href="https://github.com/cheton/monorepo-release-changesets/pull/1/files#diff-88fbe28c4102501b94961511a0d70ff895bf39970b4d3fc11917794a239117c5">+3/-0</a>&nbsp; &nbsp; &nbsp; </td>

</tr>                    

<tr>
  <td>
    <details>
      <summary><strong>lerna.json</strong><dd><code>Update Lerna configuration for Yarn</code>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </dd></summary>
<hr>

lerna.json

<li>Added <code>npmClient</code> and <code>npmClientArgs</code> fields.<br> <li> Removed <code>useWorkspaces</code> field.<br>


</details>


  </td>
  <td><a href="https://github.com/cheton/monorepo-release-changesets/pull/1/files#diff-2d72bdead8afa0798d18995311992d684348a694c2d5e214e8e4d2b6153e4821">+3/-3</a>&nbsp; &nbsp; &nbsp; </td>

</tr>                    
</table></td></tr><tr><td><strong>Enhancement</strong></td><td><table>
<tr>
  <td>
    <details>
      <summary><strong>package.json</strong><dd><code>Update package.json for Yarn 3.2.4 and project details</code>&nbsp; &nbsp; &nbsp; </dd></summary>
<hr>

package.json

<li>Changed project name to <code>monorepo</code>.<br> <li> Updated homepage, bugs, and repository URLs.<br> <li> Modified <code>workspaces</code> configuration.<br> <li> Updated <code>lerna</code> dependency to version 8.1.5.<br> <li> Added <code>packageManager</code> field to specify Yarn 3.2.4.<br>


</details>


  </td>
  <td><a href="https://github.com/cheton/monorepo-release-changesets/pull/1/files#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519">+10/-12</a>&nbsp; </td>

</tr>                    
</table></td></tr></tr></tbody></table>

___

> 💡 **PR-Agent usage**:
>Comment `/help` on the PR to get a list of all available PR-Agent tools and their descriptions


