```mermaid
graph TD

    subgraph subgraph_head ["`**Head**
    Structural Intelligence`"]

        H1[Helpers]
        H2[Grid]
        H3[Units]
        H4[Mixins]
        H5[Functions]

    end

    subgraph subgraph_body ["`**Body**
    Composition Anatomy`"]

        B1[Cell]
        B2[Tissue]
        B3[Organ]
        B4[Skeleton]
        B5[Body]

    end

    subgraph subgraph_soul ["`**Soul**
    Aesthetic Experience`"]

        subgraph Typography
            S1a[Scale]
            S1b[Typeset]
        end

        subgraph Color
            S2a[Palette]
            S2b[Tokens]
            S2c[Feedback]
        end

        subgraph Themes
            S3a[Light]
            S3b[Dark]
        end

        subgraph Appearance
            S4a[Shadows]
            S4b[Borders]
            S4c[Rounding]
        end

        subgraph Motion
            S5a[Transitions]
            S5b[Easings]
            S5c[Animations]
        end
    end

    subgraph_head ~~~ subgraph_body
    subgraph_body ~~~ subgraph_soul

```
